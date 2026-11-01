import '@nordhealth/components/lib/Input'
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Checkbox'
import '@nordhealth/components/lib/Tooltip'
import '@nordhealth/components/lib/VisuallyHidden'
import NordIcon from '@nordhealth/components/lib/Icon'
import showPasswordIcon from '@nordhealth/icons/lib/assets/interface-edit-on.svg?raw'
import hidePasswordIcon from '@nordhealth/icons/lib/assets/interface-edit-off.svg?raw'

NordIcon.registerIcon('interface-edit-on', showPasswordIcon)
NordIcon.registerIcon('interface-edit-off', hidePasswordIcon)

export default defineNuxtPlugin(() => {})
