import { colors } from "@/constants/Colors";

export const STATUS_TO_COLOR_MAP: Record<
  "paid" | "pending" | "draft",
  {
    background: string;
    text: string;
    indicator: string;
  }
> = {
  pending: {
    background: "rgba(230, 159, 56, 0.5)",
    text: "#F2B857",
    indicator: "#F2B857",
  },
  paid: {
    background: "rgba(128, 224, 177, 0.5)",
    text: "#80E0B1",
    indicator: "#80E0B1",
  },
  draft: {
    background: "rgba(136, 142, 176, 0.5)",
    text: colors.white[100],
    indicator: colors.white[100],
  },
};
