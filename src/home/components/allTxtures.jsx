import styles from '../index.module.scss'
import { useEffect, useState } from 'react'
import { Image, Pagination  } from 'antd';
import { getTextureInfo } from '../../request/api'


function AllTextures({insertTexture}){
    const pageSize = 200
    const [textures, setTextures] = useState([])
    const [texturesPage, setTexturespage] = useState([])
    const [current, setCurrent] = useState(1)
    const getTextureId = (id) => {
        const hexId = id.toString(16).toUpperCase()
        return hexId.padStart(14, '0')
    }

    const getImageUrl = (id) => {
        return `https://assets.overwatchitemtracker.com/textures/${id.slice(2)}.png`
    }


    const initTextureInfo= async () => {
        const textureInfo = await getTextureInfo()

        const _textures = textureInfo.textures
            .filter((texId, i) => {
                const versionRemovedId = textureInfo.tex_ver_removed[i]
              return !versionRemovedId
            })
            .map((texId, i) => {
            const textureId = getTextureId(texId)
            const versionAddedId = textureInfo.tex_ver_added[i]
            const versionRemovedId = textureInfo.tex_ver_removed[i]
            const versionUpdatedId = textureInfo.tex_ver_updated[i]

            return {
                id: textureId,
                id_raw: texId,
                version_added_id: versionAddedId,
                version_removed_id: versionRemovedId,
                version_updated_id: versionUpdatedId,
                version_added: textureInfo.versions[versionAddedId - 1],
                version_removed: textureInfo.versions[versionRemovedId - 1],
                version_updated: textureInfo.versions[versionUpdatedId - 1],
                is_removed: versionRemovedId !== 0,
                is_new: versionAddedId === textureInfo.versions.length,
                is_updated: versionUpdatedId === textureInfo.versions.length,
                url: getImageUrl(textureId)
            }

        })

        window._textures = _textures
        setTextures(_textures)
        pageChange(1)
    }

    const pageChange = (current) => {

        setCurrent(current)
        setTexturespage(window._textures.slice((current-1) * pageSize, (current-1) * pageSize + pageSize))
    }


    useEffect(() => {
        initTextureInfo()
    }, [])


    return (
        <div className={styles.allTexturesContainer}>
            <div className={styles.allTexturesList}>
                {
                    texturesPage.map(item => {
                        return  <Image
                            preview={false}
                            src={item.url}
                            key={item.id}
                            className={styles.texturesImg}
                            onClick={() => insertTexture(item)}
                        />
                    })
                }
            </div>
            <div className={styles.pageButton}>
                <Pagination size="small"
                            current={current}
                            total={textures.length}
                            showQuickJumper
                            showSizeChanger={false}
                            align="end"
                            onChange={pageChange}
                            defaultPageSize={pageSize}
                />
            </div>
        </div>
    );
}

export default AllTextures
