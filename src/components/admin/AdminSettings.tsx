import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { HeroEditor } from './HeroEditor';
import { toast } from 'sonner@2.0.3';
import axios from 'axios';
import { User, Lock, Save, Loader2 } from 'lucide-react';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('http://localhost:8000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({
        name: response.data.user.name,
        email: response.data.user.email,
      });
    } catch (error) {
      console.error('Failed to fetch profile', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const payload: any = {
        name: user.name,
        email: user.email,
      };

      if (passwords.current_password) {
        payload.current_password = passwords.current_password;
        payload.new_password = passwords.new_password;
        payload.new_password_confirmation = passwords.new_password_confirmation;
      }

      await axios.put('http://localhost:8000/api/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Profile updated successfully');
      setPasswords({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error: any) {
      console.error('Failed to update profile', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
        <p className="text-muted-foreground">Manage your account and platform settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="landing" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10">
            <span className="w-4 h-4 mr-2">🌐</span>
            Landing Page
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 max-w-2xl">
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details and password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="bg-white/50 dark:bg-white/5"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="bg-white/50 dark:bg-white/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Change Password
                    </h3>
                    <div className="grid gap-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input
                        id="current_password"
                        type="password"
                        value={passwords.current_password}
                        onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                        className="bg-white/50 dark:bg-white/5"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                    {passwords.current_password && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input
                            id="new_password"
                            type="password"
                            value={passwords.new_password}
                            onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                            className="bg-white/50 dark:bg-white/5"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                          <Input
                            id="new_password_confirmation"
                            type="password"
                            value={passwords.new_password_confirmation}
                            onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                            className="bg-white/50 dark:bg-white/5"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="landing">
          <HeroEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
