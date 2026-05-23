<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

function close() {
  open.value = false
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

watch(open, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="terms-backdrop" @click="onBackdropClick">
        <div class="terms-modal" role="dialog" aria-labelledby="terms-title">
          <header class="terms-header">
            <h2 id="terms-title" class="text-base font-semibold">Terms of Use &amp; Disclaimer</h2>
            <button
              type="button"
              class="terms-close"
              aria-label="Close"
              @click="close"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </header>

          <div class="terms-body">
            <h3>Theoretical model — not authoritative</h3>
            <p>
              This site is a <strong>theoretical visualization</strong> of a hypothetical hazardous materials incident, built for situational-awareness, educational, and journalism purposes. The blast radii, shrapnel envelope, toxic plume, and wind animation are produced from simplified physical models (TNT-equivalent scaling, Gaussian dispersion approximations) and use generic chemical properties. They are <strong>not</strong> the output of ALOHA, CAMEO, SAFER, or any authoritative emergency-response dispersion modeling.
            </p>

            <h3>No warranty</h3>
            <p>
              The site is provided <strong>"as is"</strong> and "as available" without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, accuracy, completeness, timeliness, or non-infringement. No representation is made that the information presented reflects current conditions, actual evacuation orders, or real chemical-release behavior.
            </p>

            <h3>No liability</h3>
            <p>
              By accessing or using this site, you agree that the author, contributors, and any affiliated parties shall not be liable for any direct, indirect, incidental, consequential, special, exemplary, or punitive damages arising from or related to your use of, or inability to use, the site — including, without limitation, decisions made or actions taken in reliance on any data, model output, marker, or label presented here.
            </p>

            <h3>Use authoritative sources for real emergencies</h3>
            <p>
              In an actual emergency, follow the instructions of local authorities. For Garden Grove and surrounding Orange County areas, contact:
            </p>
            <ul>
              <li><strong>Emergency:</strong> <a href="tel:911">9-1-1</a></li>
              <li><strong>Information hotline (non-emergency questions, evacuation guidance):</strong> <a href="tel:+17147415444">714-741-5444</a></li>
              <li><strong>Orange County Fire Authority:</strong> <a href="https://x.com/OCFireAuthority" target="_blank" rel="noopener">@OCFireAuthority on X</a></li>
              <li><strong>OC Public Works emergency map:</strong> <a href="https://ocpw.maps.arcgis.com/" target="_blank" rel="noopener">ocpw.maps.arcgis.com</a></li>
            </ul>

            <h3>Third-party data</h3>
            <p>
              Satellite imagery © Esri. Wind data via Open-Meteo. Evacuation polygon sourced from OC Public Works' public ArcGIS feature service. These third parties retain ownership of their data and are not responsible for how it is rendered here.
            </p>

            <p class="terms-acknowledgement">
              By continuing to use this site, you acknowledge that you have read, understood, and accepted these terms.
            </p>
          </div>

          <footer class="terms-footer">
            <button type="button" class="terms-accept" @click="close">I understand</button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.terms-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.6);
  display: grid;
  place-items: center;
  padding: 24px;
}

.terms-modal {
  width: 100%;
  max-width: 640px;
  max-height: calc(100vh - 48px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.terms-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid rgb(229 231 235);
}

.terms-close {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  color: rgb(107 114 128);
  border-radius: 4px;
}

.terms-close:hover {
  background: rgb(243 244 246);
  color: rgb(31 41 55);
}

.terms-body {
  padding: 16px 22px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.55;
  color: rgb(55 65 81);
}

.terms-body h3 {
  font-size: 13px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 4px;
  color: rgb(17 24 39);
}

.terms-body h3:first-child {
  margin-top: 0;
}

.terms-body p {
  margin: 0 0 8px 0;
}

.terms-body ul {
  list-style: disc;
  padding-left: 22px;
  margin: 4px 0 8px 0;
}

.terms-body li {
  margin: 2px 0;
}

.terms-body a {
  color: rgb(37 99 235);
  text-decoration: underline;
}

.terms-acknowledgement {
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px dashed rgb(209 213 219);
  font-size: 12px;
  font-style: italic;
  color: rgb(107 114 128);
}

.terms-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 18px;
  border-top: 1px solid rgb(229 231 235);
  background: rgb(249 250 251);
}

.terms-accept {
  background: rgb(31 41 55);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.terms-accept:hover {
  background: rgb(17 24 39);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
