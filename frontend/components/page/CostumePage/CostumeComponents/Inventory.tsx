import * as style from "./style/Inventory";
import ItemBox from "@/components/common/Itembox/ItemBox";
import { useState, useEffect } from "react";
import { getMyCostumes } from "@/pages/api/main";

type ItemType = {
  name: string;
  imgSrc: string;
};

const typeList: ItemType[] = [
  {
    name: "HEAD",
    imgSrc: "/InventoryType/head.png",
  },
  {
    name: "BODY",
    imgSrc: "/InventoryType/body.png",
  },
  {
    name: "EFFECT",
    imgSrc: "/InventoryType/effect.png",
  },
];

const Inventory = (props: any) => {
  const handleItemClick = (itemInfo: {}) => {
    // 클릭한 아이템의 정보를 상위 컴포넌트로 전달
    props.onItemClick(itemInfo);
  };

  const handleTypeClick = (typeName: string) => {
    setItemType(typeName);
  };

  const [itemType, setItemType] = useState("HEAD");
  const [headArr, setHeadArr] = useState([]);
  const [bodyArr, setBodyArr] = useState([]);
  const [effectArr, setEffectArr] = useState([]);

  const [myHeadItems, setMyHeadItems] = useState([]);
  const [myBodyItems, setMyBodyItems] = useState([]);
  const [myEffectItems, setMyEffectItems] = useState([]);

  useEffect(() => {
    const index0 = {
      costumeId: 0,
      name: "empty",
      category: itemType,
      questId: null,
      imgUrl: "/CostumeItems_IMG/empty.png",
      gifUrl: "/CostumeItems_GIF/empty.gif",
    };

    if (itemType === "HEAD") {
      const arr: any = [index0, ...props.headItemList];
      setHeadArr(arr);
    } else if (itemType === "BODY") {
      const arr: any = [index0, ...props.bodyItemList];
      setBodyArr(arr);
    } else {
      const arr: any = [index0, ...props.effectItemList];
      setEffectArr(arr);
    }
  }, [itemType]);

  // 사용자가 보유한 아이템 조회하자
  useEffect(() => {
    const userId = "9302629d-ae6a-43b6-a965-996d5429783c";

    const getMyItems = async () => {
      // 내가 보유한 HEAD 코스튬 목록 불러오기
      const resMyHEAD = await getMyCostumes(userId, "HEAD");
      // 내가 보유한 BODY 코스튬 목록 불러오기
      const resMyBODY = await getMyCostumes(userId, "BODY");
      // 내가 보유한 EFFECT 코스튬 목록 불러오기
      const resMyEFFECT = await getMyCostumes(
        userId,
        "EFFECT"
      );

      setMyHeadItems(resMyHEAD.data.content);
      setMyBodyItems(resMyBODY.data.content);
      setMyEffectItems(resMyEFFECT.data.content);
    };

    getMyItems();
  }, []);

  return (
    <style.Inventory>
      <style.InventoryBar>
        {typeList.map((type, index) => (
          <style.InventoryType
            key={index}
            onClick={() => handleTypeClick(type.name)}
            selected={itemType === type.name}
          >
            <style.InventoryTypeImg
              src={type.imgSrc}
              alt={type.name}
            />
          </style.InventoryType>
        ))}
      </style.InventoryBar>
      {itemType === "HEAD" && (
        <style.InventoryBox>
          {headArr.map((item: any, index: number) => (
            <ItemBox
              item={item}
              key={index}
              selected={myHeadItems.some(
                (myItem: any) =>
                  myItem.costumeId === item.costumeId ||
                  item.costumeId === 0
              )}
              onItemClick={handleItemClick}
            />
          ))}
        </style.InventoryBox>
      )}
      {itemType === "BODY" && (
        <style.InventoryBox>
          {bodyArr.map((item: any, index: number) => (
            <ItemBox
              item={item}
              key={index}
              selected={myBodyItems.some(
                (myItem: any) =>
                  myItem.costumeId === item.costumeId ||
                  item.costumeId === 0
              )}
              onItemClick={handleItemClick}
            />
          ))}
        </style.InventoryBox>
      )}
      {itemType === "EFFECT" && (
        <style.InventoryBox>
          {effectArr.map((item: any, index: number) => (
            <ItemBox
              item={item}
              key={index}
              selected={myEffectItems.some(
                (myItem: any) =>
                  myItem.costumeId === item.costumeId ||
                  item.costumeId === 0
              )}
              onItemClick={handleItemClick}
            />
          ))}
        </style.InventoryBox>
      )}
    </style.Inventory>
  );
};

export default Inventory;
