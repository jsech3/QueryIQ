import CodeMirror from '@uiw/react-codemirror'
import { sql, SQLite } from '@codemirror/lang-sql'

type Props = {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  minHeight?: string
}

export default function SqlEditor({ value, onChange, placeholder, minHeight = '140px' }: Props) {
  return (
    <div className="rounded-lg overflow-hidden border border-[var(--color-border)]">
      <CodeMirror
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        theme="dark"
        minHeight={minHeight}
        extensions={[sql({ dialect: SQLite })]}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          autocompletion: true,
          bracketMatching: true,
        }}
      />
    </div>
  )
}
