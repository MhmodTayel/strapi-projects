import React from 'react'
import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
    @font-face {
        font-family: 'loewNext';
        src: url('./Loew-Next-Arabic-Medium.ttf');
        font-weight: normal;
        font-style: normal;
      }
    @font-face {
        font-family: 'loewNext';
        src: url('./Loew-Next-Arabic-Bold.ttf');
        font-weight: Bold;
        font-style: Bold;
      }
      `}
  />
)

export default Fonts