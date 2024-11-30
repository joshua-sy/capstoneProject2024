/*
  Takes user input C code, compile options and executables user selected and pass onto API
  If successful, returns 
    graphs in dotstring, 
    error message from static analysis tools
    LLVM IR
    Terminal Output
  If fail (especially if code doesnt compile in clang), 
    returns clang error message
*/
const submitCodeFetch = async (code: string, compileOptions: string, executables: string[]) => {
  
  // URL endpoint to make api call on
  const url = 'https://api-morning-fog-5849.fly.dev/api/controller';

  /*
  Request Body for the api endpoint
  input =  user C code
  compileOptions = selected compile options
  extraExecutables = e.g (ae, saber, MTA)
  */
  const requestBody = {
    input: code,
    compileOptions: compileOptions,
    extraExecutables: executables
  };

// Perform the fetch request and return API response
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (!response.ok) {
      // console.log(response.json());
      // throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    // Handle the response data here
    return data;
  })
  .catch(error => {
    // Handle any errors here
    console.error('Error:', error);
  });
}
 

export default submitCodeFetch



