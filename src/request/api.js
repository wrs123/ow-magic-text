import axios from 'axios'


export const getTextureInfo = async() => {
    const res = await axios.get('https://assets.overwatchitemtracker.com/data/texture_info.json')
    return res.data
}