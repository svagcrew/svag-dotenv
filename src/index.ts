import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

const findFilePath = ({ cwd, lastPathPart }: { cwd: string; lastPathPart: string }): string | null => {
  const maybeEnvFilePath = path.join(cwd, lastPathPart)
  if (fs.existsSync(maybeEnvFilePath)) {
    return maybeEnvFilePath
  }
  if (cwd === '/') {
    return null
  }
  return findFilePath({ cwd: path.dirname(cwd), lastPathPart })
}

export const applyDotEnvFiles = ({
  cwd,
  lastPathPart = '.env',
  withNodeEnvSuffig = true,
  withProcessEnv = true,
}: {
  cwd: string
  lastPathPart?: string
  withNodeEnvSuffig?: boolean
  withProcessEnv?: boolean
}) => {
  const data = withProcessEnv ? { ...process?.env } : {}
  const envFilePath = findFilePath({ cwd, lastPathPart })
  if (envFilePath) {
    dotenv.config({ path: envFilePath, override: true })
    Object.assign(data, dotenv.parse(fs.readFileSync(envFilePath)))
  }
  if (withNodeEnvSuffig) {
    const envFilePathWithNodeEnvSuffix = findFilePath({ cwd, lastPathPart: `${lastPathPart}.${process.env.NODE_ENV}` })
    if (envFilePathWithNodeEnvSuffix) {
      dotenv.config({ path: envFilePathWithNodeEnvSuffix, override: true })
      Object.assign(data, dotenv.parse(fs.readFileSync(envFilePathWithNodeEnvSuffix)))
    }
  }
  Object.assign(process.env, data)
  return data
}

export const getDotEnvData = ({
  cwd,
  lastPathPart = '.env',
  withNodeEnvSuffig = true,
  withProcessEnv = true,
}: {
  cwd: string
  lastPathPart?: string
  withNodeEnvSuffig?: boolean
  withProcessEnv?: boolean
}) => {
  const data = withProcessEnv ? { ...process?.env } : {}
  const envFilePath = findFilePath({ cwd, lastPathPart })
  if (envFilePath) {
    Object.assign(data, dotenv.parse(fs.readFileSync(envFilePath)))
  }
  if (withNodeEnvSuffig) {
    const envFilePathWithNodeEnvSuffix = findFilePath({ cwd, lastPathPart: `${lastPathPart}.${process.env.NODE_ENV}` })
    if (envFilePathWithNodeEnvSuffix) {
      Object.assign(data, dotenv.parse(fs.readFileSync(envFilePathWithNodeEnvSuffix)))
    }
  }
  return data
}
