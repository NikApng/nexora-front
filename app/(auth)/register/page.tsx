import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    return (
        <main className={'flex flex-col justify-center items-center w-full h-full '}>
        <Card className="w-[400px] p-6">
            <CardHeader>
                <h1 className="text-2xl font-bold text-center">Create account</h1>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Имя</Label>
                    <Input />
                </div>

                <div className="space-y-2">
                    <Label>Почта</Label>
                    <Input type="email" />
                </div>

                <div className="space-y-2">
                    <Label>Пароль</Label>
                    <Input type="password" />
                </div>
            </CardContent>

            <CardFooter>
                <Button className="w-full">Далее</Button>
            </CardFooter>
        </Card>
        </main>
    );
}
