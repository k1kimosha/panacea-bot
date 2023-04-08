import { english } from "./english.js";


export function locales(language: "en-US") {
    switch (language) {
        case "en-US":
            return english;
    }
}