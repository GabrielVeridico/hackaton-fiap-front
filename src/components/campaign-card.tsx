import type { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatBRL } from '@/lib/format';
import type { TransparencyCampaign } from '@/domain/transparency/transparency-campaign';

export function CampaignCard({
  campaign,
  action,
}: {
  campaign: TransparencyCampaign;
  action?: ReactNode;
}) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl leading-snug">{campaign.title}</CardTitle>
        {campaign.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{campaign.description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="mt-auto space-y-3">
        <Progress
          value={campaign.percentage}
          aria-label={`${campaign.percentage}% arrecadado`}
          className="h-2.5"
        />
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold text-primary">{formatBRL(campaign.amountRaised)}</span>
          <span className="text-sm font-medium text-muted-foreground">{campaign.percentage}%</span>
        </div>
        <p className="text-sm text-muted-foreground">Meta: {formatBRL(campaign.goal)}</p>
      </CardContent>
      {action ? <CardFooter className="border-t pt-4">{action}</CardFooter> : null}
    </Card>
  );
}
