package com.cobby.main.avatar.api.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cobby.main.avatar.api.dto.request.AvatarPatchRequest;
import com.cobby.main.avatar.api.dto.response.AvatarGetResponse;
import com.cobby.main.avatar.api.service.AvatarService;
import com.cobby.main.avatar.db.entity.Avatar;
import com.cobby.main.avatar.db.repository.AvatarCostumeRepository;
import com.cobby.main.avatar.db.repository.AvatarRepository;
import com.cobby.main.avatar.db.repository.LevelTableRepository;
import com.cobby.main.costume.api.dto.response.CostumeGetResponse;
import com.cobby.main.costume.db.entity.Costume;
import com.cobby.main.costume.db.entity.enumtype.CostumeCategory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AvatarServiceImpl implements AvatarService {

	private final AvatarRepository avatarRepository;

	private final LevelTableRepository levelTableRepository;

	private final ObjectMapper objectMapper;

	private final AvatarCostumeRepository avatarCostumeRepository;

	@Override
	public AvatarGetResponse selectAvatar(String avatarId) throws JsonProcessingException {
		var avatar = avatarRepository.findById(avatarId)
			.orElseThrow(() -> new IllegalArgumentException("아바타 정보가 없습니다. (ID=" + avatarId + ")"));

		var outfits = getCostumeOutfits(avatar.getOutfits());

		var levelTable = levelTableRepository.findById(avatar.getLevel())
			.orElseThrow(() -> new IllegalArgumentException("레벨 정보가 없습니다. (Level=" + avatar.getLevel() + ")"));

		return AvatarGetResponse.builder()
			.nextExp(levelTable.getNextExp())
			.avatar(avatar)
			.outfits(outfits)
			.build();


	}

	private Map<String, CostumeGetResponse> getCostumeOutfits(final String idMapString) throws JsonProcessingException {
		// String 을 Map 으로 변환
		Map<String, Long> idMap = objectMapper.readValue(
			idMapString,
			objectMapper.getTypeFactory().constructParametricType(Map.class, String.class, Long.class)
		);

		var NO_COSTUME = 0L;
		var outfits = new HashMap<String, CostumeGetResponse>();

		// 맵에 들어있는 key (costume의 카테고리) value 들 (costume id)을 순회하며
		idMap.forEach((category, costumeId) -> {
				// 코스튬 Id가 0인 경우 "empty" 라는 이름을 가진 빈 객체를 DTO 형태로 outfits map에 넣습니다.
				if(NO_COSTUME == costumeId) {
					var emptyCostume = Costume.builder()
						.costumeId(0L)
						.name("empty")
						.category(CostumeCategory.valueOf(category.toUpperCase()))
						.quest(null)
						.imgUrl("")
						.gifUrl("")
						.build();

					outfits.put(
						category,
						CostumeGetResponse.builder()
							.costume(emptyCostume)
							.build());
				}
				// 코스튬 Id가 0 이상인 경우에는 해당 ID를 가진 코스튬을 넣습니다.
				else {
					var costume = avatarCostumeRepository.findByCostume_CostumeId(costumeId)
						.orElseThrow(() -> new IllegalArgumentException(
							"보유하고 있지 않은 코스튬입니다. (category=" + category + ", ID=" + costumeId + ")"))
						.getCostume();

					outfits.put(
						category,
						CostumeGetResponse.builder()
							.costume(costume)
							.build()
					);
				}
		});

		return outfits;
	}

	@Override
	public String insertDefaultAvatar(String avatarId) throws JsonProcessingException {
		avatarRepository.findById(avatarId)
			.ifPresent((x) -> {
				throw new IllegalArgumentException("이미 존재하는 아바타입니다.");
			});

		var newAvatar = getDefaultAvatar(avatarId);

		return avatarRepository.save(newAvatar).getAvatarId();
	}

	// @KafkaListener(topics = "make-avatar")
	// public String saveDefaultAvatar(String avatarId) throws JsonProcessingException {
	// 	log.info("Massage received ===> " + avatarId);
	//
	// 	// 아바타가 존재하면 예외 발생
	// 	avatarRepository.findById(avatarId)
	// 		.ifPresent((x) -> {
	// 			throw new IllegalArgumentException("이미 존재하는 아바타입니다.");
	// 		});
	//
	// 	var newAvatar = getDefaultAvatar(avatarId);
	//
	// 	return avatarRepository.save(newAvatar).getAvatarId();
	// }

	@Override
	public String updateAvatar(String avatarId, AvatarPatchRequest avatarUpdateInfo) throws JsonProcessingException {

		var avatar = avatarRepository.findById(avatarId)
			.orElseThrow(() -> new IllegalArgumentException("아바타 정보가 없습니다. (ID=" + avatarId + ")"));

		Map<String, Long> currentCostumeIds = objectMapper.readValue(
			avatar.getOutfits(),
			objectMapper.getTypeFactory().constructParametricType(Map.class, String.class, Long.class));

		var head = Optional.ofNullable(avatarUpdateInfo.head())
			.orElse(currentCostumeIds.get("head"));
		var body = Optional.ofNullable(avatarUpdateInfo.body())
			.orElse(currentCostumeIds.get("body"));
		var effect = Optional.ofNullable(avatarUpdateInfo.effect())
			.orElse(currentCostumeIds.get("effect"));

		avatar = avatar.toBuilder()
			.outfits(objectMapper.writeValueAsString(
				Map.of("head", head, "body", body, "effect", effect)))
			.build();

		return avatarRepository.save(avatar).getAvatarId();
	}

	@Override
	public String resetAvatar(String avatarId) throws JsonProcessingException {
		var avatar = avatarRepository.findById(avatarId)
			.orElseThrow(() -> new IllegalArgumentException("아바타 정보가 없습니다. (ID=" + avatarId + ")"));

		return avatarRepository.save(getDefaultAvatar(avatarId)).getAvatarId();
	}

	@Override
	public String deleteAvatar(String avatarId) {
		var avatar = avatarRepository.findById(avatarId)
			.orElseThrow(() -> new IllegalArgumentException("아바타 정보가 없습니다. (ID=" + avatarId + ")"));

		avatarRepository.deleteById(avatarId);

		return avatar.getAvatarId();
	}

	private Avatar getDefaultAvatar(String userId) throws JsonProcessingException {

		var deafaultOutfits = Map.of(
			"head", CostumeCategory.NO_COSTUME.ordinal(),
			"body", CostumeCategory.NO_COSTUME.ordinal(),
			"effect", CostumeCategory.NO_COSTUME.ordinal()
		);

		return Avatar.builder()
			.avatarId(userId)
			.level(1)
			.exp(0)
			.outfits(objectMapper.writeValueAsString(deafaultOutfits))
			.build();
	}
}
