import type { Locale } from "@/domain/content";
import { promoContent } from "@/content/promo";
import { PromoChallengeExplorer } from "../PromoInteractions";

export default function PromoChallenges({ locale }: { locale: Locale }) {
  return (
    <PromoChallengeExplorer
      challenges={promoContent.challenges}
      locale={locale}
      section={promoContent.challengesSection}
      ui={{
        challengeCount: promoContent.ui.challengeCount,
        newTabHint: promoContent.ui.newTabHint,
        orbitLabel: promoContent.ui.orbitLabel,
      }}
    />
  );
}
