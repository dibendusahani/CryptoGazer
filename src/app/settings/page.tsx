
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Settings</CardTitle>
            <CardDescription>Manage your application and profile settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Profile</h3>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="User Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="user@example.com" />
              </div>
              <Button>Update Profile</Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Appearance</h3>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="theme-switcher" className="font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred light or dark theme.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Notifications</h3>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates and alerts via email.
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get real-time alerts on your device.
                  </p>
                </div>
                <Switch id="push-notifications" />
              </div>
            </div>
             <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">API Keys</h3>
                <div className="space-y-2">
                    <Label htmlFor="coingecko-api">CoinGecko API Key</Label>
                    <Input id="coingecko-api" type="password" placeholder="Enter your CoinGecko API Key" />
                     <p className="text-xs text-muted-foreground">
                        Used for fetching cryptocurrency data. Get yours from <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="underline">CoinGecko</a>.
                    </p>
                </div>
                 <Button variant="secondary">Save API Key</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
