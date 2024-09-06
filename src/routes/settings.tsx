import { createSignal, onMount } from 'solid-js'
import toast from 'solid-toast'
import store from 'store2'
import { handleTabCloak } from '../lib/cloak'
import { handleDebug } from '../lib/debug'
import { handleTheme, themes } from '../lib/theme'
import { DebugData, PanicData, TabData, ThemeData, TransportData, aboutblankData } from '../lib/types'

import { CircleCheck } from 'lucide-solid'
import { exportData, importData, resetData } from '../lib/browsingdata'
import { handleTransport } from '../lib/transport'

export default function Settings() {
  const [tabName, setTabName] = createSignal('The Project Gutenberg eBook of Flatland, by Edwin A. Abbott')
  const [tabIcon, setTabIcon] = createSignal('https://www.gutenberg.org/cache/epub/97/images/cover.jpg')

  const [panicKey, setPanicKey] = createSignal('`')
  const [panicUrl, setPanicUrl] = createSignal('https://www.gutenberg.org/cache/epub/97/pg97-images.html')

  const [aboutBlank, setAboutBlank] = createSignal('disabled')

  const [theme, setTheme] = createSignal('bumblebee')

  const [debug, setDebug] = createSignal('disabled')

  const [transport, setTransport] = createSignal('epoxy')

  var fileImport: HTMLInputElement
  var exportWarning: HTMLDialogElement
  var importWarning: HTMLDialogElement
  var deleteWarning: HTMLDialogElement

  onMount(() => {
    const tabData = store('tab') as TabData
    if (tabData.name) setTabName(tabData.name)
    if (tabData.icon) setTabIcon(tabData.icon)

    const panicData = store('panic') as PanicData
    if (panicData.key) setPanicKey(panicData.key)
    if (panicData.url) setPanicUrl(panicData.url)

    const aboutblankData = store('aboutblank') as aboutblankData
    if (aboutblankData.enabled) {
      setAboutBlank('enabled')
    } else {
      setAboutBlank('disabled')
    }

    const themeData = store('theme') as ThemeData
    if (themeData.theme) setTheme(themeData.theme)

    const debugData = store('debug') as DebugData
    if (debugData.enabled) setDebug('enabled')

    const transportData = store('transport') as TransportData
    if (transportData.transport) setTransport(transportData.transport)
  })

  function save() {
    store('tab', {
      name: tabName(),
      icon: tabIcon()
    })

    store('panic', {
      key: panicKey(),
      url: panicUrl()
    })

    store('aboutblank', {
      enabled: aboutBlank() == 'enabled'
    })

    store('theme', {
      theme: theme()
    })

    store('debug', {
      enabled: debug() == 'enabled'
    })

    store('transport', {
      transport: transport()
    })

    handleTabCloak()
    handleDebug()
    handleTheme()
    handleTransport()

    toast.custom(() => {
      return (
        <div class="toast toast-center toast-top">
          <div class="alert alert-success w-80">
            <CircleCheck />
            <span>Settings saved.</span>
          </div>
        </div>
      )
    })
  }

  return (
    <div class="flex flex-col items-center gap-4">
      <div class="box-border flex flex-wrap justify-center gap-6 pt-8">
        <div class="flex w-80 flex-col items-center gap-4 rounded-box bg-base-200 p-4">
          <h1 class="text-2xl font-semibold">Cloaking</h1>
          <p class="text-xs">Change how Mocha appears in your browser</p>
          <input type="text" class="input input-bordered w-full" value={tabName()} onInput={(e) => setTabName(e.target.value)} placeholder="Tab name" />
          <input type="text" class="input input-bordered w-full" value={tabIcon()} onInput={(e) => setTabIcon(e.target.value)} placeholder="Tab icon" />
        </div>

        <div class="flex w-80 flex-col items-center gap-4 rounded-box bg-base-200 p-4">
          <h1 class="text-2xl font-semibold">Panic Key</h1>
          <p class="text-center text-xs">Press a key to redirect to a URL (works in proxy)</p>
          <input type="text" class="input input-bordered w-full" value={panicKey()} onInput={(e) => setPanicKey(e.target.value)} placeholder="Panic key" />
          <input type="text" class="input input-bordered w-full" value={panicUrl()} onInput={(e) => setPanicUrl(e.target.value)} placeholder="Panic URL" />
        </div>

        <div class="flex w-80 flex-col items-center gap-4 rounded-box bg-base-200 p-4">
          <h1 class="text-2xl font-semibold">about:blank</h1>
          <p class="text-center text-xs">Open Mocha in an about:blank tab automatically</p>
          <select class="select select-bordered w-full max-w-xs" value={aboutBlank()} onChange={(e) => setAboutBlank(e.target.value)}>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        <div class="flex w-80 flex-col items-center gap-4 rounded-box bg-base-200 p-4">
          <h1 class="text-2xl font-semibold">Theme</h1>
          <p class="text-center text-xs">Change the styling of Mocha's UI</p>
          <select class="select select-bordered w-full max-w-xs" value={theme()} onChange={(e) => setTheme(e.target.value)}>
            {themes.map((item, index) => {
              return <option value={item}>{index == 0 ? 'Default' : item.charAt(0).toUpperCase() + item.slice(1)}</option>
            })}
          </select>
        </div>

        <div class="collapse collapse-arrow">
          <input type="checkbox" />
          <div class="collapse-title left-1/2 w-1/3 -translate-x-1/2 text-xl font-medium">Advanced</div>
          <div class="collapse-content mt-6">
            <div class="flex flex-wrap justify-center gap-6">
              <div class="flex w-80 flex-col items-center gap-4 rounded-box bg-base-200 p-4">
                <h1 class="text-2xl font-semibold">Debug</h1>
                <p class="text-center text-xs">Enable Eruda devtools (helps with debugging)</p>
                <select class="select select-bordered w-full max-w-xs" value={debug()} onChange={(e) => setDebug(e.target.value)}>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div class="flex w-80 flex-col items-center gap-4 rounded-box bg-base-200 p-4">
                <h1 class="text-2xl font-semibold">Transport</h1>
                <p class="text-center text-xs">Change how Mocha's proxy handles requests</p>
                <select class="select select-bordered w-full max-w-xs" value={transport()} onChange={(e) => setTransport(e.target.value)}>
                  <option value="epoxy">Epoxy</option>
                  <option value="libcurl">Libcurl</option>
                </select>
              </div>

              <div class="flex w-80 flex-col items-center gap-4 rounded-box bg-base-200 p-4">
                <h1 class="text-2xl font-semibold">Browsing Data</h1>
                <p class="text-center text-xs">Export, import, or delete your proxy browsing data</p>
                <div class="flex w-full gap-2">
                  <button class="btn btn-outline flex-1" onClick={() => exportWarning.showModal()}>
                    Export
                  </button>
                  <button class="btn btn-outline flex-1" onClick={() => importWarning.showModal()}>
                    Import
                  </button>
                </div>
                <button class="btn btn-error w-full" onClick={() => deleteWarning.showModal()}>
                  Delete
                </button>

                <input type="file" class="hidden" ref={fileImport!} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4 py-4">
        <button class="btn btn-primary px-16" onClick={save}>
          Save
        </button>
        <button
          class="btn btn-error px-16"
          onClick={() => {
            setTabIcon('https://www.gutenberg.org/cache/epub/97/images/cover.jpg')
            setTabName('The Project Gutenberg eBook of Flatland, by Edwin A. Abbott')
            setPanicKey('`')
            setPanicUrl('https://www.gutenberg.org/cache/epub/97/pg97-images.html')
            setAboutBlank('disabled')
            setTheme('bumblebee')
            save()
          }}
        >
          Reset
        </button>
      </div>

      <dialog class="modal" ref={exportWarning!}>
        <div class="modal-box">
          <h3 class="text-lg font-bold">Continue with export?</h3>
          <p class="py-4">
            Warning! This file contains all the data that would normally be stored in your browser if you were to visit websites un-proxied on your computer. This includes any logins you used while inside the proxy. <span class="font-bold underline">Don't give this file to other people.</span>
          </p>
          <div class="modal-action">
            <form method="dialog" class="flex gap-2">
              <button class="btn w-28">Cancel</button>
              <button class="btn btn-success w-28" onClick={exportData}>
                Proceed
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog class="modal" ref={importWarning!}>
        <div class="modal-box">
          <h3 class="text-lg font-bold">Current browsing data will be removed</h3>
          <p class="py-4">Warning! By proceeding, your proxy browsing data will be replaced by the imported data. This is irreversible. Continue?</p>
          <div class="modal-action">
            <form method="dialog" class="flex gap-2">
              <button class="btn w-28">Cancel</button>
              <button class="btn btn-error w-28" onClick={() => importData(fileImport)}>
                Proceed
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog class="modal" ref={deleteWarning!}>
        <div class="modal-box">
          <h3 class="text-lg font-bold">Current browsing data will be deleted</h3>
          <p class="py-4">Warning! By proceeding, your proxy browsing data will be wiped completely. This is irreversible. Continue?</p>
          <div class="modal-action">
            <form method="dialog" class="flex gap-2">
              <button class="btn w-28">Cancel</button>
              <button class="btn btn-error w-28" onClick={() => resetData()}>
                Proceed
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}
