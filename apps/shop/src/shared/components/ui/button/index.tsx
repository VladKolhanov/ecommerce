import { Button as ButtonBase } from '@base-ui-components/react/button'

import s from './index.module.css'

export const Button = ({ children }: ButtonBase.Props) => {
  return <ButtonBase className={s.button}>{children}</ButtonBase>
}
