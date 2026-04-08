import { Button as ButtonPrimitive } from "@base-ui/react"

import s from "./index.module.css"

export const Button = ({ children }: ButtonPrimitive.Props) => {
  return <ButtonPrimitive className={s.button}>{children}</ButtonPrimitive>
}
