<template>
  <div class="luckysheet-wrapper">
    <!-- Toolbar Zoom -->
    <div class="zoom-toolbar">
      <button class="btn-zoom" @click="zoomOut">−</button>
      <span class="zoom-label">{{ Math.round(zoomRatio * 100) }}%</span>
      <button class="btn-zoom" @click="zoomIn">＋</button>
      <button class="btn-reset" @click="resetZoom">Reset</button>
    </div>

    <!-- Container LuckySheet -->
    <div
      :id="containerId"
      ref="luckysheetContainer"
      class="luckysheet-container"
    ></div>
  </div>
</template>

<script>
import LuckyExcel from "luckyexcel";

export default {
  name: "LuckySheetWrapper",

  props: {
    data: { type: [Array, Object, String], default: null },
    templateUrl: { type: String, default: "/WRASTemplate.xlsx" },
    title: { type: String, default: "WRAS Template" },
    readOnly: { type: Boolean, default: false },
  },

  data() {
    return {
      containerId: `luckysheetContainer-${this._uid}`,
      luckysheetLib: null,
      zoomRatio: 1, // default 100%
    };
  },

  async mounted() {
    await this.loadResources();

    if (this.data) {
      this.loadData(this.data);
    } else {
      const response = await fetch(this.templateUrl);
      const blob = await response.blob();
      const file = new File([blob], this.templateUrl.split("/").pop());

      LuckyExcel.transformExcelToLucky(file, (exportJson) => {
        this.loadData(exportJson.sheets);
      });
    }
  },

  methods: {
    async loadResources() {
      await import("luckysheet/dist/plugins/css/pluginsCss.css");
      await import("luckysheet/dist/css/luckysheet.css");
      await import("luckysheet/dist/assets/iconfont/iconfont.css");

      if (!this.luckysheetLib) {
        const { default: luckysheet } = await import("luckysheet/dist/luckysheet.umd.js");
        this.luckysheetLib = luckysheet;
      }
    },

    loadData(newData) {
      if (!this.luckysheetLib) return;

      let parsedData = newData;
      if (typeof parsedData === "string") {
        try {
          parsedData = JSON.parse(parsedData);
        } catch (e) {
          console.error("Gagal parse data Luckysheet:", e);
          parsedData = [];
        }
      }
      if (!Array.isArray(parsedData)) parsedData = [parsedData];

      const api = this.luckysheetLib;

      if (window.luckysheet && typeof window.luckysheet.destroy === "function") {
        window.luckysheet.destroy();
      }

      api.create({
        container: this.containerId,
        data: parsedData,
        title: this.title,
        showtoolbar: !this.readOnly,
        showinfobar: false,
        showsheetbar: true,
        showstatisticBar: true,
        allowEdit: !this.readOnly,
        zoomRatio: this.zoomRatio,
      });
    },

    // 🔍 Zoom Controls
    zoomIn() {
      this.setZoom(this.zoomRatio + 0.1);
    },
    zoomOut() {
      this.setZoom(this.zoomRatio - 0.1);
    },
    resetZoom() {
      this.setZoom(1);
    },
    setZoom(value) {
      this.zoomRatio = Math.max(0.3, Math.min(2, value)); // min 30%, max 200%
      if (window.luckysheet && typeof window.luckysheet.zoomRatio === "number") {
        window.luckysheet.zoomRatio = this.zoomRatio;
      }
      if (window.luckysheet && typeof window.luckysheet.refresh === "function") {
        window.luckysheet.refresh();
      }
    },

    sheetApi() {
      const api = this.luckysheetLib || window.luckysheet;
      return {
        getAllSheets: () => {
          if (api && typeof api.getAllSheets === "function") {
            return JSON.parse(JSON.stringify(api.getAllSheets()));
          }
          return [];
        },
        setCellValue: (r, c, value, sheetName = null) => {
          if (!api) return;
          let sheetIndex = 0;
          if (sheetName) {
            const sheet = api.getAllSheets().find((s) => s.name === sheetName);
            if (sheet) sheetIndex = sheet.index;
          }
          api.setCellValue(r, c, value, { sheetIndex });
        },
      };
    },
  },
};
</script>

<style scoped>
.luckysheet-wrapper {
  position: relative;
  width: 100%;
  height: 90vh;
  overflow: hidden;
  background: #fff;
}

.zoom-toolbar {
  position: absolute;
  top: 6px;
  right: 10px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.btn-zoom,
.btn-reset {
  border: none;
  background: #f0f0f0;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
}

.btn-zoom:hover,
.btn-reset:hover {
  background: #e0e0e0;
}

.zoom-label {
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.luckysheet-container {
  width: 100%;
  height: 100%;
}
</style>
