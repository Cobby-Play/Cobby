import styled from "styled-components";

export const FullDiv = styled.div`
  //   display: inline-block;
  width: 62%;
  height: 10px;
  background-color: #fff;
  margin-top: 0.5%;
  margin-left: 1%;
  border: 2px solid #333333;
  @media (max-width: 1300px) {
    width: 46.5%;
    margin-top: 0.3%;
  }
  @media (max-width: 1200px) {
    width: 46.5%;
    margin-top: 0.5%;
  }
  @media (max-width: 1100px) {
    width: 46.5%;
    margin-top: 0.6%;
  }
  @media (max-width: 1100px) {
    width: 46.5%;
    margin-top: 0.7%;
  }
  @media (max-width: 711px) {
    width: 46.5%;
    margin-top: 0.1%;
  }
`;

<<<<<<< HEAD
export const RangeDiv = styled.div<{ level: number; fullLevel: number }>`
  //   display: inline-block;
  width: ${(props) => (props.level / props.fullLevel) * 100}%;
=======
export const RangeDiv = styled.div<{
  prevExp: number;
  exp: number;
  nextExp: number;
}>`
  //   display: inline-block;
  width: ${(props) =>
    ((props.exp - props.prevExp) / (props.nextExp - props.prevExp)) * 100}%;
>>>>>>> b0bd697a84067e765ab6e03479a065209faf7f34
  height: 100%;
  background-color: #333333;
`;
