import assert from 'node:assert';
import { subscribeNewsletter } from '../app/actions/contact';
import { formatCurrency, formatDate } from '../lib/utils';

async function runTests() {
  console.log('Running Solix Unit Tests...');

  // Test 1: formatCurrency
  assert.strictEqual(formatCurrency(6000000), '$6,000,000');
  console.log('✓ formatCurrency passed');

  // Test 2: formatDate
  const formatted = formatDate('2024-08-05');
  assert.ok(formatted.includes('August'));
  assert.ok(formatted.includes('2024'));
  console.log('✓ formatDate passed');

  // Test 3: subscribeNewsletter invalid
  const invalidRes = await subscribeNewsletter('invalid-email');
  assert.strictEqual(invalidRes.success, false);
  console.log('✓ subscribeNewsletter invalid email validation passed');

  // Test 4: subscribeNewsletter valid
  const validRes = await subscribeNewsletter('investor@cleanenergy.com');
  assert.strictEqual(validRes.success, true);
  console.log('✓ subscribeNewsletter valid submission passed');

  console.log('All tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
