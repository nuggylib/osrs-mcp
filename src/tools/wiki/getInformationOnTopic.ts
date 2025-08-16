import axios from 'axios';

export async function getInformationOnTopic(
  searchTerm: string,
  limit: number = 10
): Promise<any> {
  
  if (!searchTerm || searchTerm.trim() === '') {
    throw new Error('Search term cannot be empty');
  }
  
  try {
    const response = await axios.get<any>(
      'https://oldschool.runescape.wiki/rest.php/v1/search/title',
      {
        params: {
          q: searchTerm.trim(),
          limit: limit
        },
        headers: {
          'User-Agent': 'osrs-mcp/1.0.0'
        }
      }
    );

    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(response.data, null, 2)
            }
        ]
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        params: error.config?.params
      });
      throw new Error(`Failed to search Wiki: ${error.response?.status} ${error.response?.statusText} - ${error.message}`);
    }
    throw error;
  }
}