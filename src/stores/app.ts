import { defineStore } from "pinia";
import {ref} from 'vue'

export const useAppStore= defineStore('app',()=>{
const sideBarExpanded=ref<boolean>(true)

const toggleSide=()=>{
sideBarExpanded.value=!sideBarExpanded.value
}
return{sideBarExpanded,toggleSide}
})