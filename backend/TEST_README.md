# Personality API Tests

This directory contains comprehensive unit tests for the `/calculatePersonality` API endpoint.

## 🧪 Test Coverage

The tests cover the following functionality:

### ✅ Core Functionality
- **Personality Archetype Determination**: Tests all 9 personality archetypes (Strategist, Coordinator, Builder, etc.)
- **Comprehensive Power Moves**: Validates the generation of personalized power moves
- **Hook Lines & Descriptions**: Ensures correct personality descriptions and hook lines
- **Data Structure Validation**: Verifies all required fields are present and correctly typed

### ✅ Edge Cases
- **Missing Personality Traits**: Tests fallback behavior when personality traits are not provided
- **Error Handling**: Validates proper error responses for invalid data
- **Performance**: Ensures API responses are under 5 seconds

### ✅ Data Validation
- **Response Structure**: Validates the complete API response structure
- **Field Types**: Ensures all fields have correct data types
- **Required Fields**: Checks that all required fields are present

## 🚀 Running the Tests

### Prerequisites
1. Make sure the API server is running:
   ```bash
   npm run dev
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Test Commands

#### Quick Test Run
```bash
npm test
```

#### Verbose Test Run (Recommended)
```bash
npm run test:personality
```

#### Watch Mode (for development)
```bash
npm run test:watch
```

#### Coverage Report
```bash
npm run test:coverage
```

#### Using the Test Runner Script
```bash
./run-tests.sh
```

## 📋 Test Cases

### 1. Strategist Personality
- **Input**: `analyst.planner` personality traits
- **Expected**: Returns "Strategist" archetype
- **Hook Line**: "You love a plan and turn small routines into big impact."
- **Description**: Contains "You like a plan. Lists are your love language"

### 2. Coordinator Personality
- **Input**: `analyst.collaborator` personality traits
- **Expected**: Returns "Coordinator" archetype
- **Hook Line**: "You bring people together to make things happen—collaboratively."
- **Description**: Contains "You're a behind-the-scenes powerhouse"

### 3. Builder Personality
- **Input**: `connector.planner` personality traits
- **Expected**: Returns "Builder" archetype
- **Hook Line**: "You break goals into steps and create systems that stick."
- **Description**: Contains "You love turning ideas into action"

## 🔧 Test Configuration

### Environment Variables
- `API_BASE_URL`: Base URL for the API (default: http://localhost:3000)
- `NODE_ENV`: Set to 'test' for testing environment

### Test Timeout
- Default timeout: 10 seconds per test
- Performance test: Must complete under 5 seconds

## 📊 Expected Test Results

When all tests pass, you should see:

```
🧪 Running tests against: http://localhost:3000/api/personality/calculate

📋 Testing: Should return Strategist archetype for analyst.planner combination
✅ API Response received:
   - Archetype: Strategist
   - Decision: Analyst
   - Action: Planner
   - Hook Line: You love a plan and turn small routines into big impact.
✅ Test passed: Strategist Personality

📋 Testing: Should return Coordinator archetype for analyst.collaborator combination
✅ API Response received:
   - Archetype: Coordinator
   - Decision: Analyst
   - Action: Collaborator
   - Hook Line: You bring people together to make things happen—collaboratively.
✅ Test passed: Coordinator Personality

📋 Testing: Should return Builder archetype for connector.planner combination
✅ API Response received:
   - Archetype: Builder
   - Decision: Connector
   - Action: Planner
   - Hook Line: You break goals into steps and create systems that stick.
✅ Test passed: Builder Personality

🎉 All personality API tests completed!

📊 Test Coverage:
   ✅ Personality archetype determination
   ✅ Comprehensive power moves generation
   ✅ Hook lines and descriptions
   ✅ Error handling
   ✅ Performance validation
   ✅ Data structure validation
```

## 🐛 Troubleshooting

### Common Issues

1. **API Server Not Running**
   ```
   ❌ API server is not running on http://localhost:3000
   ```
   **Solution**: Start the server with `npm run dev`

2. **Network Timeout**
   ```
   ❌ Network Error: No response received from server
   ```
   **Solution**: Check if the API endpoint is accessible and server is running

3. **Test Timeout**
   ```
   ❌ Test timeout: API response took too long
   ```
   **Solution**: Check server performance and database connections

4. **Wrong Archetype Returned**
   ```
   ❌ Expected "Strategist" but got "Builder"
   ```
   **Solution**: Check personality trait mapping in the backend logic

### Debug Mode

To run tests with more detailed logging:

```bash
DEBUG=* npm run test:personality
```

## 📝 Adding New Tests

To add a new test case:

1. Add a new test case to the `testCases` array in `test-personality-api.test.js`
2. Define the input data with appropriate personality traits
3. Specify the expected archetype, hook line, and description
4. Run the tests to verify the new case works

Example:
```javascript
{
  name: 'New Personality Type',
  description: 'Should return NewType archetype for decision.action combination',
  input: {
    // ... test data
    personalityTraits: {
      relationshipWithChange: 'decision',
      // ... other traits
    }
  },
  expected: {
    archetype: 'NewType',
    decision: 'Decision',
    action: 'Action',
    hookLine: 'Expected hook line.',
    descriptionContains: 'Expected description content'
  }
}
```

## 🎯 Test Goals

These tests ensure that:

1. **API Reliability**: The endpoint consistently returns correct data
2. **Data Integrity**: All required fields are present and correctly formatted
3. **Performance**: Responses are fast enough for production use
4. **Error Handling**: Invalid requests are handled gracefully
5. **Personality Accuracy**: The correct archetype is determined based on input traits

By running these tests regularly, you can ensure the personality API remains functional and accurate as the codebase evolves. 