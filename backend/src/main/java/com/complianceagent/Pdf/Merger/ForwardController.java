package com.complianceagent.Pdf.Merger;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardController {

    @RequestMapping(value = { "/", "/{x:[\\w\\-]+}" })
    public String getIndex() {
        return "forward:/index.html";
    }
}
