import { Locale } from "discord.js";
import { english } from "./english.js";


export function locales(options: { locale?: Locale, guildLocale?: string, language?: "en-US" }) {
    if (options.locale)
        switch (options.locale) {
            case "en-US":
                return english;
        }

    if (options.guildLocale)
        switch (options.guildLocale) {
            case "en-US":
                return english;
        }

    switch (options.language) {
        case "en-US":
            return english;
    }
}