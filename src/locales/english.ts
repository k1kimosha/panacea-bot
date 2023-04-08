export const english = {
    locale: "English",
    admin: {
        commands: {
            group: {
                title: "admin",
                description: "Admin commands"
            },
            locales: {
                title: "locales",
                description: "Change the preferred language",
                options: {
                    locale: {
                        name: "locale",
                        description: "Pregerred language"
                    }
                }
            }
        },
        responses: {
            locale: {
                info: {
                    title: "Info",
                    description: "Current guild pregerred language is $lang"
                },
                success: {
                    title: "Success",
                    description: "The server language has been changed to $lang"
                },
                errorAI: {
                    title: "Error",
                    description: "This language is already installed on the guild"
                },
                errorFC: {
                    title: "Error",
                    description: "Failed to change the guild language, try again later"
                },
                errorSC: {
                    title: "Unforeseeable error",
                    description: "There was an error on the server side, it is temporarily impossible to change the language"
                }
            }
        }
    }
}