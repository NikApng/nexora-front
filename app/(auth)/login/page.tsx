import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className={'flex flex-col justify-center items-center w-full h-full '}>
            <Card className="w-[400px] p-6">
                <CardHeader>
                    <h1 className="text-2xl font-bold text-center">Login in account</h1>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Имя</Label>
                        <Input/>
                    </div>

                    <div className="space-y-2">
                        <Label>Почта</Label>
                        <Input type="email"/>
                    </div>

                    <div className="space-y-2">
                        <Label>Пароль</Label>
                        <Input type="password"/>
                    </div>
                </CardContent>

                <CardFooter className={'flex flex-col justify-center items-center w-full h-full '}>
                    <Button className="">Далее</Button>
                    <p className="text-sm text-center text-muted-foreground">
                        еще нет аккаунта?{" "}
                        <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                            Регистрация
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    );
}
