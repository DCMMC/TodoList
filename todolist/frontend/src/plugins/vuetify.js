import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import manifestJSON from '../..//public/manifest.json';

import {
  VApp,
  VBtn,
  VBtnToggle,
  VCard,
  VCheckbox,
  VDivider,
  VIcon,
  VList,
  VProgressLinear,
  VTextField,
  VToolbar,
  VTooltip
} from 'vuetify/lib';

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VBtnToggle,
    VCard,
    VCheckbox,
    VDivider,
    VIcon,
    VList,
    VProgressLinear,
    VTextField,
    VToolbar,
    VTooltip
  },
  theme: {
    primary: manifestJSON.theme_color
  }
});

const opts = {}

export default new Vuetify(opts);
