import { DirectiveDoc } from '../models/directive-doc.model';

export const DIRECTIVE_DOCS: readonly DirectiveDoc[] = [
  {
    slug: 'thai-citizen-id',
    type: 'Attribute directive (Validator)',
    name: 'appThaiCitizenId',
    lede:
      'จัดรูปแบบเลขบัตรประชาชนไทยอัตโนมัติ (1-2345-67890-12-3) และตรวจสอบความถูกต้องของเลข 13 หลักด้วย checksum แบบ modulus-11',
    meta: [
      { label: 'Type', value: 'Attribute' },
      { label: 'Selector', value: 'input[appThaiCitizenId]' },
      { label: 'Provides', value: 'NG_VALIDATORS' },
      { label: 'Since', value: 'v1.0' },
    ],
    previewCaption: 'Type 13 digits — auto-formats and validates the checksum',
    code: {
      filename: 'thai-citizen-id-demo.html',
      language: 'html',
      content: '<input appThaiCitizenId formControlName="citizenId" maxlength="17" />',
    },
    notes: [
      'ตัดอักขระที่ไม่ใช่ตัวเลขออก และจำกัดการกรอกไว้ที่ 13 หลัก',
      'การคำนวณ checksum เป็นไปตามกฎ modulus-11 ของกรมการปกครอง',
    ],
  },
  {
    slug: 'thai-phone',
    type: 'Attribute directive (Validator)',
    name: 'appThaiPhone',
    lede:
      'จัดรูปแบบและตรวจสอบเบอร์โทรศัพท์มือถือและเบอร์บ้านของไทย พร้อมแปลงรหัส +66 ให้เป็นเลข 0 นำหน้า',
    meta: [
      { label: 'Type', value: 'Attribute' },
      { label: 'Selector', value: 'input[appThaiPhone]' },
      { label: 'Provides', value: 'NG_VALIDATORS' },
      { label: 'Since', value: 'v1.0' },
    ],
    previewCaption: 'Type a number — formats as you go (mobile / landline)',
    code: {
      filename: 'thai-phone-demo.html',
      language: 'html',
      content: '<input appThaiPhone formControlName="phone" inputmode="tel" maxlength="12" />',
    },
    notes: [
      'มือถือ 0XX-XXX-XXXX (06/08/09), กรุงเทพฯ 0X-XXX-XXXX (02), ต่างจังหวัด 0XX-XXX-XXX',
      'แปลงรหัสนำหน้า +66 / 66 ให้เป็นเลข 0 โดยอัตโนมัติ',
    ],
  },
  {
    slug: 'thai-currency',
    type: 'Attribute directive (ControlValueAccessor)',
    name: 'appThaiCurrency',
    lede:
      'จัดรูปแบบตัวเลขที่กรอกให้เป็นสกุลเงินไทย (1,234,567.89) โดยเก็บค่าเป็นตัวเลขดิบไว้ใน FormControl',
    meta: [
      { label: 'Type', value: 'Attribute' },
      { label: 'Selector', value: 'input[appThaiCurrency]' },
      { label: 'Provides', value: 'NG_VALUE_ACCESSOR' },
      { label: 'Since', value: 'v1.0' },
    ],
    previewCaption: 'Type a number — formats on blur, stores the raw value',
    code: {
      filename: 'thai-currency-demo.html',
      language: 'html',
      content: '<input appThaiCurrency formControlName="creditLimit" inputmode="decimal" />',
    },
    notes: [
      'เก็บค่าเป็นตัวเลขดิบใน FormControl ไม่ใช่สตริงที่มีเครื่องหมายคอมมา',
      'ลบการจัดรูปแบบออกเมื่อโฟกัสเพื่อให้แก้ไขง่าย และจัดรูปแบบใหม่เมื่อออกจากช่อง',
    ],
  },
  {
    slug: 'debounce-click',
    type: 'Attribute directive',
    name: 'appDebounceClick',
    lede:
      'ส่ง event การคลิกแบบ debounce เพื่อป้องกันการกดส่งซ้ำซ้อนในการกระทำที่ POST ไปยัง backend',
    meta: [
      { label: 'Type', value: 'Attribute' },
      { label: 'Selector', value: '[appDebounceClick]' },
      { label: 'Output', value: 'appDebounceClick' },
      { label: 'Since', value: 'v1.0' },
    ],
    previewCaption: 'Click rapidly — only one emission per debounce window',
    code: {
      filename: 'debounce-click-demo.html',
      language: 'html',
      content: '<button (appDebounceClick)="onSubmit()" [debounceTime]="800">Save</button>',
    },
    notes: [
      'ดักจับการคลิกปกติไว้ และส่ง (appDebounceClick) หลังจากครบช่วงเวลา debounce (ค่าเริ่มต้น 500ms)',
      'อย่าผูก (click) บนอิลิเมนต์เดียวกันนี้อีก',
    ],
  },
  {
    slug: 'highlight-search',
    type: 'Attribute directive',
    name: 'appHighlightSearch',
    lede:
      'ครอบคำค้นหาที่ตรงกันด้วยแท็ก <mark> ภายในอิลิเมนต์ — ปลอดภัยจาก XSS ด้วยการใช้ DOM text node',
    meta: [
      { label: 'Type', value: 'Attribute' },
      { label: 'Selector', value: '[appHighlightSearch]' },
      { label: 'Inputs', value: 'text, highlightClass' },
      { label: 'Since', value: 'v1.0' },
    ],
    previewCaption: 'Type to highlight matches in the list below',
    code: {
      filename: 'highlight-search-demo.html',
      language: 'html',
      content: '<span [appHighlightSearch]="term()" [text]="customer.name"></span>',
    },
    notes: [
      'ใช้ DOM text node (ไม่ใช้ innerHTML) — ปลอดภัยจาก XSS',
      'ไม่สนใจตัวพิมพ์เล็ก-ใหญ่ และ escape อักขระพิเศษของ regex ในคำค้นหา',
    ],
  },
];
