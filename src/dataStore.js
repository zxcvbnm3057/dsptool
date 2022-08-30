import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import factoryData from "./data.json";

// redux cant handle non-serializable data in state or actions

function addRecipes(recipeData) {
  /* 
      i: ingredient
      n: product number
      t: produce time
      m: machine
      e: can not get extra product
  */
  return {
    i: recipeData.i || {},
    n: recipeData.n || 1,
    t: recipeData.t || 1,
    m: recipeData.m,
    e: recipeData.e || false,
  };
}

// 0 is bool "false" in JS so count from 1 to using Boolean calculation
// all of the number is count in second

function addRequire() {
  /* 
      n: require demand
      t: total demand
      fl: factory level 
      r: round recipe demand
        1: round off
        2: no action
        3: round on
      pl: proliferator level
        1: no proliferator
        2: MK.Ⅰ
        3：MK.Ⅱ
        4: MK.Ⅲ
      pe: proliferator effect
        1: faster
        2: more
      s: surplus
      c: super compounds
      i: the chosen recipe index number
  */
  return {
    n: 0,
    t: 0,
    fl: 1,
    r: 0,
    pl: 0,
    pe: 1,
    s: 0,
    c: {},
    i: 0,
  };
}

function calculate(state, name, number, source) {
  var requireData = state.requireData[name];
  var recipeData = state.recipeData[name][requireData.i];

  if (null != number) {
    if (undefined === source) {
      requireData.n = number;
    } else {
      requireData.c[source] = number;
    }
  }

  requireData.t = requireData.n;
  for (const c in requireData.c) {
    requireData.t += requireData.c[c];
  }

  requireData.m =
    ((requireData.t / recipeData.n) * recipeData.t) /
    (state.factoryData.speed[recipeData.m]?.[requireData.fl] ?? 1) /
    state.factoryData.proliferator[requireData.pl || state.globalSetting.pl][requireData.pe];

  switch (requireData.r || state.globalSetting.r) {
    case 1:
      requireData.m = Math.floor(requireData.m);
      break;
    case 3:
      requireData.m = Math.ceil(requireData.m);
      break;
    default:
      break;
  }

  requireData.s =
    (requireData.m *
      (state.factoryData.speed[recipeData.m]?.[requireData.fl] ?? 1) *
      state.factoryData.proliferator[requireData.pl || state.globalSetting.pl][requireData.pe] *
      recipeData.n) /
      recipeData.t -
    requireData.t;

  for (const ingredient in recipeData.i) {
    calculate(
      state,
      ingredient,
      (recipeData.i[ingredient] * requireData.t) /
        state.factoryData.proliferator[requireData.pl || state.globalSetting.pl][requireData.pe],
      name
    );
  }
}

export const calculatorSlice = createSlice({
  name: "counter",
  initialState: () => {
    var recipeData = {};
    var requireData = {};
    for (const product in factoryData.recipes) {
      if (Object.hasOwnProperty.call(factoryData.recipes, product)) {
        recipeData[product] = [];
        for (const recipe of factoryData.recipes[product]) {
          recipeData[product].push(addRecipes(recipe));
        }
        requireData[product] = addRequire();
      }
    }
    return {
      globalSetting: {
        unitInSecond: false,
        r: 2,
        pl: 1,
      },
      recipeData: recipeData,
      requireData: requireData,
      factoryData: factoryData.factory,
      saveData: {},
    };
  },
  reducers: {
    globalSettingChanged: (state, action) => {
      state.globalSetting = { ...state.globalSetting, ...action.payload };
      for (const item in state.requireData) {
        if (state.requireData[item].n) calculate(state, item, state.requireData[item].n);
      }
    },
    numberChanged: (state, action) => {
      let { name, number } = action.payload;
      calculate(state, name, number);
      return state;
    },
    recipeChanged: (state, action) => {
      let { name, value } = action.payload;
      for (const ingredient in state.recipeData[name][state.requireData[name].i].i) {
        calculate(state, ingredient, 0, name);
      }
      state.requireData[name].i = value;
      calculate(state, name);
      return state;
    },
    roundMethodChanged: (state, action) => {
      let { name, value } = action.payload;
      state.requireData[name].r = value;
      calculate(state, name);
      return state;
    },
    factoryLevelChanged: (state, action) => {
      let { name, value } = action.payload;
      state.requireData[name].fl = value;
      calculate(state, name);
      return state;
    },
    proliferatorLevelChanged: (state, action) => {
      let { name, value } = action.payload;
      state.requireData[name].pl = value;
      calculate(state, name);
      return state;
    },
    proliferatorEffectChanged: (state, action) => {
      let { name, value } = action.payload;
      state.requireData[name].pe = value;
      calculate(state, name);
      return state;
    },
    saveRequireData: (state, action) => {
      state.saveData[action.payload] = {
        globalSetting: state.globalSetting,
        requireData: state.requireData,
      };
      return state;
    },
    loadRequireData: (state, action) => {
      state = { ...state, ...state.saveData[action.payload] };
      return state;
    },
    deleteRequireData: (state, action) => {
      delete state.saveData[action.payload];
      return state;
    },
    resetRequireData: (state) => {
      for (const item in state.requireData) {
        if (state.requireData[item].n) calculate(state, item, 0);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  globalSettingChanged,
  numberChanged,
  recipeChanged,
  roundMethodChanged,
  factoryLevelChanged,
  proliferatorLevelChanged,
  proliferatorEffectChanged,
  saveRequireData,
  loadRequireData,
  deleteRequireData,
  resetRequireData,
} = calculatorSlice.actions;

const persistConfig = {
  key: "data",
  storage,
  whitelist: ["saveData"],
};

const persistedReducer = persistReducer(persistConfig, calculatorSlice.reducer);
let store = configureStore({
  reducer: persistedReducer,
});
let persistor = persistStore(store);
export { store, persistor };
