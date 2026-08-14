import { Text } from '@react-pdf/renderer'
import { styles } from './scoresPdfStyles'

export function PDFFooter() {
  return (
    <Text style={styles.footer}>
      Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
    </Text>
  )
}
