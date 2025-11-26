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
import { useUserContext } from '@/providers/authContext';
import { Link, useNavigate } from 'react-router-dom';
import LogoSVG from '@/assets/LogoSVG';

export default function SignUp() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      plate_number: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useUserContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log(data);
      await register(data.username, data.password, data.plate_number.toLowerCase());
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
            <CardTitle className="text-3xl font-bold">Đăng ký</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Vui lòng điền thông tin để tạo tài khoản
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                rules={{ 
                  required: 'Vui lòng nhập tên đăng nhập',
                  minLength: {
                    value: 3,
                    message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
                  }
                }}
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
                control={form.control}
                name="password"
                rules={{ 
                  required: 'Vui lòng nhập mật khẩu',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                  }
                }}
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

              <FormField
                control={form.control}
                name="plate_number"
                rules={{ 
                  required: 'Vui lòng nhập biển số xe',
                  pattern: {
                    value: /^\d{2}[A-Z]\d{4,5}$/i,
                    message: 'Biển số xe không hợp lệ (VD: 30A-12345)'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biển số xe</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: 30A-12345"
                        {...field}
                        className="uppercase"
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
