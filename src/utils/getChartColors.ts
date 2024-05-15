import { StockType } from "../types/type";

export function getChartColors(
  length: number,
  type: StockType
): { backgroundColorData: string[]; borderColorData: string[] } {
  const colorData = {
    japan: {
      backgroundColorList: [
        "rgba(61, 72, 139, 0.4)",
        "rgba(74, 113, 188, 0.4)",
        "rgba(88, 159, 239, 0.4)",
        "rgba(144, 208, 255, 0.4)",
        "rgba(255, 80, 80, 0.4)",
        "rgba(255, 143, 134, 0.4)",
        "rgba(255, 206, 191, 0.4)",
        "rgba(231, 231, 234, 0.4)",
        "rgba(181, 181, 184, 0.4)",
        "rgba(133, 133, 136, 0.4)",
      ],
      borderColorList: [
        "rgba(61, 72, 139, 0.8)",
        "rgba(74, 113, 188, 0.8)",
        "rgba(88, 159, 239, 0.8)",
        "rgba(144, 208, 255, 0.8)",
        "rgba(255, 80, 80, 0.8)",
        "rgba(255, 143, 134, 0.8)",
        "rgba(255, 206, 191, 0.8)",
        "rgba(231, 231, 234, 0.8)",
        "rgba(181, 181, 184, 0.8)",
        "rgba(133, 133, 136, 0.8)",
      ],
    },
    usa: {
      backgroundColorList: [
        "rgba(215, 53, 43, 0.4)",
        "rgba(255, 106, 85, 0.4)",
        "rgba(255, 157, 131, 0.4)",
        "rgba(255, 210, 70, 0.4)",
        "rgba(255, 167, 80, 0.4)",
        "rgba(255, 217, 118, 0.4)",
        "rgba(255, 255, 167, 0.4)",
        "rgba(255, 255, 218, 0.4)",
        "rgba(146, 199, 255, 0.4)",
        "rgba(91, 151, 238, 0.4)",
      ],
      borderColorList: [
        "rgba(215, 53, 43, 0.4)",
        "rgba(255, 106, 85, 0.4)",
        "rgba(255, 157, 131, 0.4)",
        "rgba(255, 210, 70, 0.4)",
        "rgba(255, 167, 80, 0.4)",
        "rgba(255, 217, 118, 0.4)",
        "rgba(255, 255, 167, 0.4)",
        "rgba(255, 255, 218, 0.4)",
        "rgba(146, 199, 255, 0.4)",
        "rgba(91, 151, 238, 0.4)",
      ],
    },
  };

  const selectedColors = colorData[type];

  const backgroundColorData: string[] = [];
  const borderColorData: string[] = [];

  for (let i = 0; i < length; i++) {
    const tmp_i = i % selectedColors.backgroundColorList.length;
    backgroundColorData.push(selectedColors.backgroundColorList[tmp_i]);
    borderColorData.push(selectedColors.borderColorList[tmp_i]);
  }

  return { backgroundColorData, borderColorData };
}
