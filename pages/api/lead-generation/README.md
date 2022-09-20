# Webhooks used in **Real estate lead generation** brain template

For general information about using webhooks in Moveo you can check our [documentation](https://docs.moveo.ai/docs/get_started/webhooks)

`find-property` [/api/lead-generation/find-property](#route-1-apilead-generationfind-property)

## Route 1: /api/lead-generation/find-property

This is a POST endpoint that you can call like this:

```sh
curl -X POST -H "Content-Type: application/json" -H "X-Signature: <YOUR_SIGNATURE>" -d '{ "lang": "en", "context": {"offering_type_value": "buy", "area": "Center", "property_type_value": "apartment", "price": "100000", "size": "30"}}' "https://integration-guides.moveo.ai/api/lead-generation/find-property"
```

It returns a **carousel** consisting of available properties with filters: _areas_, _property_type_value_, _offering_type_value_, _price_, _size_.

### Quick overview of the code:

1. Validate request
2. Extract context variables, entities and message from the request body
3. Check for missing parameters
4. Extract areas
5. Create size and price limits
6. Extract page
7. Extract offering type
8. Get the data from dummy endpoint
9. Create and return a carousel using the data

### Parameters (context variables)

| Name                | Required | Type   | Description                                                                                                                                                                                            |
| ------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| property_type_value | required | string | The type of the properties. <br /> <br /> Supported values: `apartment`, `detached`, `floor`, `hotel`, `industrial`, `maisonette`, `offices`, `villa`, `block-of-flats`, `retail-leisure`, `land-plot` |
| offering_type       | required | string | The offering type to differentiate tenants from buyers <br /> <br /> Supported values: `buy`, `rent`                                                                                                   |
| price               | required | number | An integer that is used as the upper limit for price of the properties                                                                                                                                 |
| size                | required | number | An integer that is used as the lower limit for size of the properties                                                                                                                                  |
| pageNumber          | optional | number | An integer that is used for paginating the results                                                                                                                                                     |
| areas_msg           | optional | string | The answer message of the user for the question "For which areas are you interested"                                                                                                                   |
| area                | optional | string | The matched area entity                                                                                                                                                                                |
| search_areas        | optional | string | The initial areas, used for subsequent searches                                                                                                                                                        |

### Responses

There are 2 possible scenarios of the webhook completing successfully:

1. The `page_number` is missing from the context (should be the first time the webhook is called) and the search has results:

   - we return a [text response](https://docs.moveo.ai/docs/get_started/response_text) informing the user for the number of the results.
   - then we return a [carousel](https://docs.moveo.ai/docs/get_started/response_carousel)

2. In all subsequent calls for more results:
   - we return only a carousel
3. There are no results from the search:
   - we return a text response to inform the user.
