//Navigation funcs

import {Navigation} from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

//Two functions
//goHome functions indicate going to home page, occurs when login and signin.  Has three navigation button
export const goHome = () =>  {
    Promise.all([
        Icon.getImageSource("md-home", 30),
        Icon.getImageSource("md-contact", 30),
        Icon.getImageSource("md-list", 30)
    ]).then(sources => {
        Navigation.setRoot({
            root: {
                bottomTabs:{
                    children:[
                        {
                            stack:{
                                children: [
                                    {
                                        component:{
                                            name:'Home',
                                            options:{
                                                bottomTab:{
                                                    icon: sources[0],      
                                                    selectedIconColor: "#FE4C4C"
                                                },
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
                                            name: 'WylldoList',
                                            options:{
                                                bottomTab:{
                                                    icon: sources[2],
                                                    selectedIconColor: "#FE4C4C"
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
                                            name: 'Profile',
                                            options:{
                                                bottomTab:{
                                                    icon: sources[1],
                                                    selectedIconColor: "#FE4C4C"
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



//goToAuth functions remove user screen to (Auth screen) authorization page when initialize or signout
export const goToAuth = () => Navigation.setRoot({
    root: {
        stack:{
            children:[
                {
                    component: {
                        name: 'Auth'
                    }
                }
            ]
        }
    }
})

export const goToInitial = () => Navigation.setRoot({
    root: {
        stack:{
            children:[
                {
                    component:{
                        name: 'Initializing'
                    }
                }
            ]
        }
    }
})