import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserContext } from '@/providers/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { Car, UserCog } from 'lucide-react';
import LogoSVG from '@/assets/LogoSVG';

export default function Signin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plate'); // 'plate' hoặc 'admin'
  
  const plateForm = useForm({
    defaultValues: {
      plate_number: '',
    },
  });

  const adminForm = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const { login, loginByPlateNumber, isAuthenticated } = useUserContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmitPlate = async (data) => {
    setLoading(true);
    try {
      await loginByPlateNumber(data.plate_number.toLowerCase());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAdmin = async (data) => {
    setLoading(true);
    try {
      await login(data.username, data.password);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 pt-10 pb-10 rounded-lg shadow-md">
        <CardHeader className="flex flex-col items-center space-y-1 mb-4">
          <div className="flex space-x-2 items-center self-center mb-2">
            <LogoSVG />
            <CardTitle className="text-3xl font-bold">Chào mừng trở lại</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Vui lòng nhập thông tin của bạn
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="plate" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Biển số xe
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Tài Khoản
              </TabsTrigger>
            </TabsList>

            {/* Tab Đăng nhập bằng biển số */}
            <TabsContent value="plate">
              <Form {...plateForm}>
                <form onSubmit={plateForm.handleSubmit(onSubmitPlate)} className="space-y-4">
                  <FormField
                    control={plateForm.control}
                    name="plate_number"
                    rules={{ 
                      required: 'Vui lòng nhập biển số xe',
                      pattern: {
                        value: /^[0-9]{2}[A-Z]?[0-9]{4,5}$/i,
                        message: 'Biển số xe không hợp lệ (VD: 30A12345)'
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biển số xe (viết liền)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: 30A12345"
                            {...field}
                            className="uppercase"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Tra cứu'}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Chưa có tài khoản?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                      Đăng ký ngay
                    </Link>
                  </p>
                </form>
              </Form>
            </TabsContent>

            {/* Tab Đăng nhập Admin */}
            <TabsContent value="admin">
              <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit(onSubmitAdmin)} className="space-y-4">
                  <FormField
                    control={adminForm.control}
                    name="username"
                    rules={{ required: 'Vui lòng nhập tên đăng nhập' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên đăng nhập"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adminForm.control}
                    name="password"
                    rules={{ required: 'Vui lòng nhập mật khẩu' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập mật khẩu"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-muted-foreground"
                      >
                        Ghi nhớ trong 30 ngày
                      </Label>
                    </div>
                    <Link
                      to="#"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Chưa có tài khoản?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                      Đăng ký ngay
                    </Link>
                  </p>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
