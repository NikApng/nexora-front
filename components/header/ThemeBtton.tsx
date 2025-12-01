import React, {useState, useEffect} from 'react';
import Sun from "@/(public)/themes/Sun";
import Moon from "@/(public)/themes/moon";
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";

function ThemeButton() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === 'dark' ? (<Moon/>) : (<Sun/>)}
        </Button>
    );
}

export default ThemeButton;