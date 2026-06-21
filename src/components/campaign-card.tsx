import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatBRL } from '@/lib/format';
import type { TransparencyCampaign } from '@/domain/transparency/transparency-campaign';

export function CampaignCard({ campaign }: { campaign: TransparencyCampaign }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{campaign.title}</CardTitle>
        {campaign.description ? (
          <p className="text-sm text-muted-foreground">{campaign.description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="mt-auto space-y-3">
        <Progress
          value={campaign.percentage}
          aria-label={`${campaign.percentage}% arrecadado`}
        />
        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-primary">{formatBRL(campaign.amountRaised)}</span>
          <span className="text-sm text-muted-foreground">{campaign.percentage}%</span>
        </div>
        <p className="text-xs text-muted-foreground">Meta: {formatBRL(campaign.goal)}</p>
      </CardContent>
    </Card>
  );
}
