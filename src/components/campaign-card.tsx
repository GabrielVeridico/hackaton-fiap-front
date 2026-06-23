import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatBRL } from '@/lib/format';
import type { TransparencyCampaign } from '@/domain/transparency/transparency-campaign';

export function CampaignCard({ campaign }: { campaign: TransparencyCampaign }) {
  return (
    <Card className="flex h-full flex-col p-2">
      <CardHeader>
        <CardTitle className="text-2xl">{campaign.title}</CardTitle>
        {campaign.description ? (
          <p className="text-base text-muted-foreground">{campaign.description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        <Progress
          value={campaign.percentage}
          aria-label={`${campaign.percentage}% arrecadado`}
          className="h-3"
        />
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-primary">{formatBRL(campaign.amountRaised)}</span>
          <span className="text-base font-medium text-muted-foreground">{campaign.percentage}%</span>
        </div>
        <p className="text-sm text-muted-foreground">Meta: {formatBRL(campaign.goal)}</p>
      </CardContent>
    </Card>
  );
}
