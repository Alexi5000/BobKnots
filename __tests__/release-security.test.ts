// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'

const roots: string[] = []
afterEach(() => roots.splice(0).forEach(root => rmSync(root, { recursive: true, force: true })))
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'release-security-'))
  roots.push(root)
  const files = ['package.json', 'src-tauri/tauri.conf.json', 'src-tauri/Cargo.toml', 'src-tauri/gen/apple/project.yml', 'src-tauri/gen/apple/app_iOS/Info.plist']
  for (const file of files) {
    mkdirSync(join(root, file, '..'), { recursive: true })
    writeFileSync(join(root, file), '{}')
  }
  mkdirSync(join(root, 'scripts'))
  writeFileSync(join(root, 'scripts/release.mjs'), readFileSync('scripts/release.mjs'))
  writeFileSync(join(root, 'scripts/sync-versions.mjs'), "import {writeFileSync} from 'node:fs'; if(process.argv[2]!=='--check')writeFileSync('package.json', JSON.stringify({version:process.argv[2]}))")
  const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  git('init'); git('config', 'user.email', 'test@example.invalid'); git('config', 'user.name', 'Test')
  git('add', '.'); git('commit', '-m', 'fixture')
  return { root, git }
}
describe('release command argument boundary', () => {
  it.each(['1.2.3', '1.2.3-rc.1+build.2'])('preserves release and tag for %s', version => {
    const { root, git } = fixture()
    const run = spawnSync(process.execPath, ['scripts/release.mjs', version], { cwd: root, encoding: 'utf8' })
    expect(run.status, run.stderr).toBe(0)
    expect(git('tag', '--list').trim()).toBe(`v${version}`)
    expect(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version).toBe(version)
  })
  it.each(['1.2.3;touch${IFS}INJECTED', '1.2.3$(touch${IFS}INJECTED)', '1.2.3`touch${IFS}INJECTED`'])('rejects shell syntax %s', version => {
    const { root, git } = fixture()
    const run = spawnSync(process.execPath, ['scripts/release.mjs', version], { cwd: root, encoding: 'utf8' })
    expect(run.status).toBe(1)
    expect(existsSync(join(root, 'INJECTED'))).toBe(false)
    expect(git('tag', '--list')).toBe('')
    expect(git('status', '--porcelain')).toBe('')
  })
})
