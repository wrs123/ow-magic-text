import styles from './index.module.scss'
import { Button } from 'antd';
import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import {AppstoreFilled, CopyFilled, MinusCircleFilled, StarFilled} from "@ant-design/icons";
import classNames from 'classnames'
import {If, Then} from 'react-if';
import AllTxtures from './components/allTxtures'
import { useState, useCallback } from 'react'
import { EditorView, Decoration } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';




function HomePage() {



    const customExtension = useCallback(() => {
        return EditorView.decorations.of(imageDecorator);
    }, []);
    const [insertList, setInsertList] = useState([])
    const [code, setCode] = useState('')
    const funcList = [
        {
            name: '全部',
            key: 'all',
            icon: <AppstoreFilled style={{fontSize: '17px'}} />,

        },
        {
            name: '收藏',
            key: 'fav',
            icon: <StarFilled style={{fontSize: '17px'}} />,

        }
    ]
    const [activeType, setActiveType] = useState('all')

    function imageDecorator(view) {
        const builder = new RangeSetBuilder();
        const text = view.state.doc.toString();
        console.warn('doc', text)
        // 匹配Markdown图片语法 ![...](...)
        const regex = /<TXC.*?>/g;
        let match;

        while ((match = regex.exec(text)) !== null) {

            const start = match.index;
            const end = start + match[0].length;
            const imageUrls = window._textures.filter(item => match[0].indexOf(item.id) > 0)
            const imageUrl = imageUrls[0].url
            console.log(match, `找到匹配: ${match[0]} 位置: ${start}-${end}, 图片：${imageUrl}`);

            if (imageUrl) {
                const deco = Decoration.widget({
                    widget: new ImageWidget(imageUrl),
                    side: 1
                });
                builder.add(start, end, deco);
            }
        }

        return builder.finish();
    }

    class ImageWidget {
        constructor(src) {
            this.src = src;
        }

        toDOM() {
            const img = document.createElement('img');
            img.src = this.src;
            img.style.width = '30px';
            img.style.maxHeight = '30px';
            return img;
        }
        // 必须实现的方法 - 用于比较小部件是否相同
        eq(other) {
            return other instanceof ImageWidget && other.src === this.src;
        }

        // 必须实现的方法 - 获取坐标位置
        coordsAt() {
            if (!this.dom) return null;
            const rect = this.dom.getBoundingClientRect();
            return {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom
            };
        }

        // 更新DOM元素
        updateDOM(dom, view) {
            if (!this.dom) return false;

            const img = dom.querySelector(".cm-image");
            if (!img) return false;

            const needsUpdate = img.src !== this.src ||
                img.alt !== this.alt ||
                img.title !== this.title;

            if (needsUpdate) {
                img.src = this.src;
                img.alt = this.alt;
                img.title = this.title;
                return true;
            }

            return false;
        }

        // 必须实现的方法 - 用于排序比较
        compare(other) {
            if (!(other instanceof ImageWidget)) return 0;
            return this.src.localeCompare(other.src);
        }

        // 可选 - 销毁时清理
        destroy() {
            if (this.dom) {
                this.dom.remove();
            }
        }

    }

    const insertTexture = (item) => {
        setInsertList([...insertList, item])
        setCode(`${code}<TXC${item.id}>`)

    }

    const copyText = async () => {
        await navigator.clipboard.writeText(code);
        console.log('复制成功');
    }

    const clearText = async () => {
       setCode('')
    }


    return (
      <div className={styles.homeContainer}>
          <div className={styles.editContainer}>
              <CodeMirror
                  value={code}
                  height='100%'
                  width='100%'
                  className={styles.editor}

                  extensions={[customExtension()]}
                  theme={oneDark}
                  onChange={(value, viewUpdate) => {
                      setCode(value)
                  }}
              />
              <div className={styles.buttonGroup}>
                  <Button className={styles.copyButton} type="primary" onClick={copyText} icon={<CopyFilled />}>复制</Button>
                  <Button color="danger" variant="solid" icon={<MinusCircleFilled />} onClick={clearText} >
                      清空
                  </Button>
              </div>

          </div>
          <div className={styles.funcContainer}>
              <div className={styles.typeList}>
                  {
                      funcList.map(item => {
                          return (
                              <div className={classNames(styles.funcItem, activeType === item.key && styles.active)} key={item.key} onClick={() => {
                                  setActiveType(item.key)
                              }}>
                                  {item.icon}
                                  <span className={styles.itemName}>{item.name}</span>
                              </div>
                          )
                      })
                  }
              </div>
              <If condition={activeType === 'all'}>
                  <Then>
                      <AllTxtures insertTexture={insertTexture} />
                  </Then>
              </If>
          </div>
      </div>
    );
}

export default HomePage;
