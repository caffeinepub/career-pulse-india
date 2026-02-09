import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function EmployersTab() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Employer Directory</p>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Browse companies and learn about potential employers. This feature is coming soon!
        </p>
      </CardContent>
    </Card>
  );
}
