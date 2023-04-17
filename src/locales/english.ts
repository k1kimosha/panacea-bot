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
            },
            clearalock: {
                title: "clearalock",
                description: "Remove moderator restrictions",
                options: {
                    admin: {
                        name: "moderator",
                        description: "Moderator from whom restrictions must be removed"
                    }
                }
            },
            telegramconnect: {
                title: "telegramconnect",
                description: "Connect telegram chat for audit",
                options: {
                    code: {
                        name: "code",
                        description: "Telegram chat code"
                    }
                }
            },
            audit: {
                title: "audit",
                description: "Set up an audit channel",
                options: {
                    channel: {
                        name: "channel",
                        description: "Audit Channel"
                    }
                }
            }
        },
        responses: {
            locales: {
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
            },
            clearalock: {
                success: {
                    title: "Success",
                    description: "Moderator restrictions have been lifted"
                },
                errorHR: {
                    title: "Error",
                    description: "The moderator has no restrictions in force"
                },
                errorSC: {
                    title: "Unforeseeable error",
                    description: "There was an error on the server side, it is temporarily impossible to change the language"
                }
            },
            telegramconnect: {
                success: {
                    title: "Success",
                    description: "Telegram chat connected"
                },
                errorAE: {
                    title: "Error",
                    description: "This chat is already connected to this server"
                },
                errorDE: {
                    title: "Error",
                    description: "The specified chat code does not exist"
                },
                errorCA: {
                    title: "Error",
                    description: "Unable to connect telegram chat"
                },
                errorSC: {
                    title: "Unforeseeable error",
                    description: "There was an error on the server side, it is temporarily impossible to change the language"
                },
                errorTE: {
                    title: "Telegram error",
                    description: "There was an error on the telegram side, the chat is connected but sending messages is not possible for the reason: $reason"
                }
            },
            audit: {
                success: {
                    title: "Success",
                    description: "Channel $channel is successfully set as an audit channel"
                },
                errorAE: {
                    title: "Error",
                    description: "This channel is already set as the audit channel of this server"
                },
                errorCA: {
                    title: "Error",
                    description: "Unable to set audit channel"
                },
                errorSC: {
                    title: "Unforeseeable error",
                    description: "There was an error on the server side, it is temporarily impossible to change the language"
                }
            }
        },
        telegram: {
            connectMessage: "Chat was connected to the discord server $server"
        }
    }
}