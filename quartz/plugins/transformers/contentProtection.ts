// File: quartz/plugins/transformers/contentProtection.ts

import { QuartzTransformerPlugin } from "../types"

export interface Options {
  // Halaman yang dilindungi harus memiliki password di frontmatter
  // Content yang akan disembunyikan ketika password tidak valid
  protectContent?: boolean
}

export const ContentProtection: QuartzTransformerPlugin<Options> = (opts?: Options) => {
  const protectContent = opts?.protectContent ?? true

  return {
    name: "ContentProtection",
    markdownPlugins() {
      return []
    },
    htmlPlugins() {
      return []
    },
    async transformContent(content, { frontmatter, slug }) {
      // Periksa apakah halaman dilindungi dengan password
      if (frontmatter.password && protectContent) {
        // Simpan nilai asli dari content di frontmatter untuk diakses oleh komponen client-side
        const protectedContent = content
        
        // Jika password frontmatter ada, ganti konten dengan placeholder
        // Konten asli hanya akan ditampilkan di sisi klien setelah password valid
        // Ini untuk mendukung rendering di server side
        frontmatter.protectedContent = protectedContent
        
        // Ganti konten dengan placeholder untuk rendering server-side
        // Konten asli akan dikembalikan oleh komponen PasswordProtection saat password benar
        return ""
      }
      
      return content
    },
    async transformData(data, { slug }) {
      // Kita tidak perlu melakukan transformasi data tambahan
      return data
    },
  }
}
