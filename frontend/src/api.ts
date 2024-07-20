const submitCodeFetch = async (code: string, compileOptions: string) => {
  console.log('code', code);
  console.log('compileOptions', compileOptions)
  // try {
  //   const response = await fetch('/your-endpoint', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ code }),
  //   });
  //   if (!response.ok) {
  //     throw new Error(`Error: ${response.statusText}`);
  //   }
  //   return await response.json();
  // } catch (error) {
  //   console.error('Error:', error);
  //   throw error;
  // }
};
export default submitCodeFetch