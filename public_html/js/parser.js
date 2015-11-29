var Parser = function (p_csv)
{
    this.csv = p_csv;

    this.Question = function ()
    {
        this.label = '';
        this.options = [];
        this.answer = '';
    };

    this.parse = function ()
    {
        var label_pos = 0;
        var options_pos = [1, 2, 3, 4];
        var answer_pos = 5;
        var separator_pos = 6;

        var csv_parsed_objects = [];
        var csv_splitted = this.csv.split(';');

        var quest_it;
        var quest_index = 0;

        csv_splitted.forEach(function (element, index, csv_splitted)
        {
            var is_new_line = index % separator_pos === 0 || index === 0;
            quest_index = is_new_line ? 0 : ++quest_index;

            // inicialización del objeto

            // si es primera iteración no se añade a la array de valores
            if (is_new_line && index === 0)
            {
                quest_it = new this.Question();
            }
            if (is_new_line && index !== 0)
            {
                csv_parsed_objects.push(quest_it);
                quest_it = new this.Question();
            }

            // en función de la posición, obtenter el valor correspondiente
            if (quest_index === label_pos)
            {
                quest_it.label = element;
            }
            if (options_pos.indexOf(quest_index) !== -1)
            {
                quest_it.options.push(element);
            }
            if (quest_index === answer_pos)
            {
                quest_it.answer = element;
            }
        }
        , this);

        // console.log(csv_parsed_objects);
        return JSON.stringify(csv_parsed_objects);
    };
};

$(function () {

    $('#csv_input').change(function (event)
    {
        $('#csv_output_ta').text('');
        
        var file = event.target.files;
        var blob = new Blob(file);
        var reader = new FileReader();
        reader.readAsText(blob);

        reader.onload = (function (theFile)
        {
            var csv_to_parse = theFile.target.result;
            var csv_parser = new Parser(csv_to_parse);

            // console.log(csv_to_parse);

            var json = csv_parser.parse();
            $('#csv_output_ta').text(json).get(0).select();            
        });
    });
});