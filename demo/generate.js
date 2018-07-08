const path = require('path')
const fs = require('fs')

module.exports = () => {
  const forms = fs.readdirSync(path.resolve(__dirname, 'forms'))
    .filter(fileName => fileName.endsWith('.tsx'))
    .map(fileName => ({
      name: fileName.replace('.tsx', ''),
      filePath: path.resolve(__dirname, 'forms', fileName)
    }))
    .map(form => ({
      ...form,
      key: `${form.name[0].toLowerCase()}${form.name.substr(1)}`,
      code: fs.readFileSync(form.filePath).toString()
    }))

  const contents = [
    ...forms.map(form => `import { ${form.name} } from './${form.name}'`),
    '',
    `export type FormType = ${forms.map(form => `'${form.key}'`).join(' | ')}`,
    `export type FormSpec = { component: any, code: string, type: FormType }`,
    ...forms.map(form => {
      return `
export const ${form.key} : FormSpec = {
  component: ${form.name},
  type: '${form.key}',
  code: \`
${form.code.replace(/`/g, "\\`")}
\`
}
`}),
    `export const forms = [${forms.map(f => f.key).join(', ')}]`
  ].join('\r\n')
  return contents
}
