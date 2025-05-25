 import { atom } from 'recoil'
 
 const authScreenAtom = atom({
    key: 'authScreen',
    default: "login"
 })

 export default authScreenAtom