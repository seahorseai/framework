Feature: Signin
  
  As a user
  I want to be able to sign in to the application
  So that I can create my personal account

    
  Rule: organizationName: string is not empty
  Rule: email: string is not empty with email format
  Rule: name: string is not empty 
  Rule: password: The password has to be alphanumeric with this format: al2*Ap34
  Rule: confirmPassword: The confirmPassword has to be equal to password
  
  Scenario: The user and organization does not exists in database
    Given a user is not registered
    When The user enters "Pepe Organization", "pepe@gmail.com", "Pepe", "al2*Ap34", "al2*Ap34"
    Then the frontend sends the user and organization to the backend
    Then the backend check the user and organization does not exist in database
    Then organization and user are created in the database
    #(We do not response a DT0)
    Then the backend response with this code status: "201" 
    Then the frontend shows the login screen

  Scenario: The user exists in database
    Given A user is registered
    When The user enters "Pepe Organization", "pepe@gmail.com", "Pepe", "al2*Ap34", "al2*Ap34"
    Then the frontend sends the user and organization to the backend
    Then the backend check the user exist in database
    Then the backend response with this status code: "409" and the DTO: "{"error": "User with email pepe@gmail.com already exists"}"
    Then the frontend shows backend's message: "User with email pepe@gmail.com already exists"
    
  Scenario: The organization exists in database
    Given A user is registered
    When The user enters "Pepe Organization", "pepe@gmail.com", "Pepe", "al2*Ap34", "al2*Ap34"
    Then the frontend sends the user and organization to the backend
    Then the backend check the user exist in database
    Then the backend response with this status code: "409" and the DTO: "{"error": "Organization with name Pepe Organization already exists"}"
    Then the frontend shows backend's message: "Organization with name Pepe Organization already exists"
    

  Scenario: User fills wrong the signin form
      Given a user is not registered
      When The user enters "", "invalid-email", "", "12345"
      Then the frontend shows a message for each incorrect field