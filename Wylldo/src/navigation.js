//Navigation funcs

import {Navigation} from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

export const goHome = () =>  {
    Promise.all([
        Icon.getImageSource("md-home", 25),
        Icon.getImageSource("md-settings", 25),
        Icon.getImageSource("md-list", 25)
    ]).then(sources => {
        Navigation.setRoot({
            root: {
                bottomTabs:{
                    id: 'BottomTabsId',
                    children:[
                        {
                            stack:{
                                children: [
                                    {
                                        component:{
                                            name:'Home',
                                            options:{
                                                bottomTab:{
                                                    fontSize: 12,
                                                    text: 'Home',
                                                    icon: sources[0]
                                                }
                                            }
                                        }
                                    }
                                ],
                            }
        
                        },
                        {
                            stack:{
                                children:[
                                    {
                                        component:{
                                            name: 'EventsList',
                                            options:{
                                                bottomTab:{
                                                    fontSize:12,
                                                    text: 'Events',
                                                    icon: sources[2]
                                                }
                                            }
                                        }
        
                                    }
                                ]
                            }
                        },
                        {
                            stack:{
                                children:[
                                    {
                                        component:{
                                            name: 'Settings',
                                            options:{
                                                bottomTab:{
                                                    fontSize:12,
                                                    text: 'Settings',
                                                    icon: sources[1]
                                                }
                                            }
                                        }
        
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        })
    })
}



export const goToAuth = () => Navigation.setRoot({
    root:{
        stack:{
            id: 'Auth',
            children:[
                {
                    component:{
                        name: 'SignIn'
                    }
                },
                {
                    component:{
                        name: 'SignUp'
                    }
                }
            ]
        }

    }
})