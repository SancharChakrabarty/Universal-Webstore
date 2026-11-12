import {
  Citrus,
  Apple,
  Grape,
  Cherry,
  Coffee,
  Leaf,
  Snowflake,
  Droplet,
  Flame,
  Sparkles,
  Wind,
  Milk,
  CupSoda,
  type LucideIcon,
} from "lucide-react";

export type FlavorIconInfo = {
  icon: LucideIcon;
  color: string;
};

// Ordered from most specific to least specific — first match wins.
const RULES: { match: RegExp; icon: LucideIcon; color: string }[] = [
  { match: /coffee|espresso/i, icon: Coffee, color: "#6b4226" },
  { match: /product|vanilla/i, icon: Coffee, color: "#a9784f" },
  { match: /cinnamon/i, icon: Flame, color: "#c1440e" },
  { match: /cola/i, icon: CupSoda, color: "#3d2b1f" },
  { match: /milkshake/i, icon: Milk, color: "#f2c94c" },
  { match: /cherry/i, icon: Cherry, color: "#9b1b30" },
  { match: /grape|blackcurrant/i, icon: Grape, color: "#8e44ad" },
  { match: /blueberry/i, icon: Droplet, color: "#3f5fd6" },
  { match: /strawberry/i, icon: Cherry, color: "#e0335e" },
  { match: /raspberry|red fruit/i, icon: Cherry, color: "#d6336c" },
  { match: /watermelon/i, icon: Apple, color: "#2fbf71" },
  { match: /peach/i, icon: Citrus, color: "#f2994a" },
  { match: /mango|tropical/i, icon: Citrus, color: "#f2994a" },
  { match: /kiwi/i, icon: Apple, color: "#8bc34a" },
  { match: /lemon|very citrus|^citrus$/i, icon: Citrus, color: "#f2c94c" },
  { match: /menthol/i, icon: Wind, color: "#17a2b8" },
  { match: /mint|mojito|spearmint|wintergreen|frosted/i, icon: Leaf, color: "#27ae60" },
  { match: /apple/i, icon: Apple, color: "#e2463f" },
  { match: /ice|freeze|cool|fizz/i, icon: Snowflake, color: "#2f9bd6" },
];

const DEFAULT_ICON: FlavorIconInfo = { icon: Sparkles, color: "#015be8" };

export function getFlavorIcon(name: string): FlavorIconInfo {
  for (const rule of RULES) {
    if (rule.match.test(name)) {
      return { icon: rule.icon, color: rule.color };
    }
  }
  return DEFAULT_ICON;
}
