
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('critical accessibility violations are zero in zh/en', async ({ page }) => { for (const lang of ['zh-Hant','en']) { await page.route('**/api/research-pulse', (route) => route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({status:'LIVE',fetchedAt:new Date().toISOString(),events:[]}) })); await page.goto('/?lang='+lang); const result = await new AxeBuilder({ page }).analyze(); const critical = result.violations.filter((item) => item.impact === 'critical'); expect(critical, JSON.stringify(critical, null, 2)).toEqual([]); } });
